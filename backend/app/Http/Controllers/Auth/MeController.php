<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\MeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MeController extends Controller
{
    public function __construct(
        protected MeService $meService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $user = $this->meService->getProfile($request->user());

        return response()->json([
            'user' => $user,
        ], 200);
    }
}
