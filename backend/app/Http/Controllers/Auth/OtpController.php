<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\OtpService;
use App\Services\Audit\AuditLogService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\UserResource;

class OtpController extends Controller
{
    public function __construct(
        protected OtpService $otpService,
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Send an OTP code to the requested email/mobile identifier.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email_or_mobile' => ['required', 'string', 'max:255'],
        ]);

        $emailOrMobile = $request->input('email_or_mobile');

        try {
            $this->otpService->sendOtp($emailOrMobile);

            // Log event in audit logs
            $user = User::where('email', $emailOrMobile)->orWhere('mobile', $emailOrMobile)->first();
            $this->auditLogService->log(
                'OTP_REQUEST', 
                "Requested OTP authentication code for: {$emailOrMobile}", 
                $user ? $user->id : null
            );

            return response()->json([
                'message' => 'Verification code sent successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Validate the provided OTP code.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email_or_mobile' => ['required', 'string', 'max:255'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $emailOrMobile = $request->input('email_or_mobile');
        $otp = $request->input('otp');

        try {
            $this->otpService->verifyOtp($emailOrMobile, $otp);

            return response()->json([
                'message' => 'OTP verified successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Authenticate a user and issue a token using OTP verification.
     */
    public function loginWithOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email_or_mobile' => ['required', 'string', 'max:255'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $emailOrMobile = $request->input('email_or_mobile');
        $otp = $request->input('otp');

        try {
            // 1. Verify OTP code
            $this->otpService->verifyOtp($emailOrMobile, $otp);

            // 2. Fetch User
            $user = User::where('email', $emailOrMobile)
                ->orWhere('mobile', $emailOrMobile)
                ->first();

            if (!$user) {
                return response()->json([
                    'message' => 'User record not found.',
                ], 404);
            }

            // 3. Issue Token
            $token = $user->createToken('auth_token')->plainTextToken;

            // 4. Log event
            $this->auditLogService->log(
                'LOGIN',
                "User logged in successfully using OTP authentication from IP " . $request->ip(),
                $user->id
            );

            return response()->json([
                'user' => new UserResource($user->load('roles')),
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
