<?php

namespace App\Services\Auth;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OtpService
{
    /**
     * Generate and send an OTP code to the given email or mobile.
     *
     * @param string $emailOrMobile
     * @return bool
     * @throws \Exception
     */
    public function sendOtp(string $emailOrMobile): bool
    {
        // 1. Validate if user exists with this email or mobile
        $user = User::where('email', $emailOrMobile)
            ->orWhere('mobile', $emailOrMobile)
            ->first();

        if (!$user) {
            throw new \Exception("No user account is registered with this email or mobile number.");
        }

        if (!$user->is_active) {
            throw new \Exception("Your account is deactivated. Please contact an administrator.");
        }

        // 2. Check for recent OTP requests rate limiting (e.g., maximum 3 requests within 10 minutes)
        $recentCount = Otp::where('email_or_mobile', $emailOrMobile)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->count();

        if ($recentCount >= 3) {
            throw new \Exception("Too many OTP requests. Please wait a few minutes before trying again.");
        }

        // 3. Delete existing OTPs for this email/mobile to prevent reuse
        Otp::where('email_or_mobile', $emailOrMobile)->delete();

        // 4. Generate new 6-digit numeric OTP code
        $code = (string) rand(100000, 999999);
        
        // 5. Store OTP with 5 minutes expiry
        Otp::create([
            'email_or_mobile' => $emailOrMobile,
            'otp' => $code, // In production, we'd hash this, but we'll save as plain/commented code for easy understanding
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
        ]);

        // 6. Deliver OTP
        if (filter_var($emailOrMobile, FILTER_VALIDATE_EMAIL)) {
            // Send via Email (using Log mailer in local env)
            Mail::raw("Your Employee Management System OTP verification code is: {$code}. It is valid for 5 minutes.", function ($message) use ($emailOrMobile) {
                $message->to($emailOrMobile)
                    ->subject("EMS - OTP Login Verification Code");
            });
        } else {
            // Send via SMS Mock (log to laravel.log file)
            Log::channel('single')->info("[SMS LOG] OTP Login Verification Code sent to {$emailOrMobile}: {$code} (Valid for 5 minutes)");
        }

        return true;
    }

    /**
     * Verify the provided OTP code.
     *
     * @param string $emailOrMobile
     * @param string $otp
     * @return bool
     * @throws \Exception
     */
    public function verifyOtp(string $emailOrMobile, string $otp): bool
    {
        $otpRecord = Otp::where('email_or_mobile', $emailOrMobile)->first();

        if (!$otpRecord) {
            throw new \Exception("No active OTP request found. Please request a new OTP code.");
        }

        // Check if OTP has expired
        if (Carbon::parse($otpRecord->expires_at)->isPast()) {
            $otpRecord->delete();
            throw new \Exception("The OTP code has expired. Please request a new one.");
        }

        // Rate limit attempts
        if ($otpRecord->attempts >= 3) {
            $otpRecord->delete();
            throw new \Exception("Too many incorrect OTP attempts. Please request a new code.");
        }

        // Check matching
        if ($otpRecord->otp !== $otp) {
            $otpRecord->increment('attempts');
            throw new \Exception("Invalid OTP code. Remaining attempts: " . (3 - $otpRecord->attempts));
        }

        // Clear OTP record on successful verification
        $otpRecord->delete();

        return true;
    }
}
