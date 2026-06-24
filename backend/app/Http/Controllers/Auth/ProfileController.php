<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

use App\Services\Audit\AuditLogService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {}

    /**
     * Update the authenticated user's profile details.
     */
    public function update(UpdateProfileRequest $request): UserResource
    {
        $user = $request->user();
        $oldDetails = ['name' => $user->name, 'email' => $user->email, 'mobile' => $user->mobile];
        $user->update($request->validated());

        $this->auditLogService->log(
            'PROFILE_UPDATE',
            "Updated profile details. Fields modified: " . json_encode(array_diff_assoc($request->validated(), $oldDetails)),
            $user->id
        );

        return new UserResource($user->load('roles'));
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'message' => 'The provided current password does not match your active password.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        $this->auditLogService->log(
            'PASSWORD_UPDATE',
            "Changed account security password",
            $user->id
        );

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }

    /**
     * Upload and update user avatar image.
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Remove old avatar if exists
        if ($user->avatar) {
            $oldPath = str_replace(url('/storage'), '', $user->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        // Store new file
        $path = $request->file('avatar')->store('avatars', 'public');
        $avatarUrl = url('/storage/' . $path);

        $user->update([
            'avatar' => $avatarUrl
        ]);

        $this->auditLogService->log(
            'AVATAR_UPLOAD',
            "Uploaded new user profile avatar image",
            $user->id
        );

        return response()->json([
            'message' => 'Avatar image uploaded successfully.',
            'avatar' => $avatarUrl,
            'user' => new UserResource($user->load('roles'))
        ]);
    }
}
