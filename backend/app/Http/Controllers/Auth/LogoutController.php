<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\LogoutService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogoutController extends Controller
{
    public function __construct(
        protected LogoutService $logoutService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $this->logoutService->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }
}
