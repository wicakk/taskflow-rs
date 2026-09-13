<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ChecklistItemController;
use App\Http\Controllers\Api\MasterDataController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/login', [AuthController::class, 'login']);

// Authenticated (Bearer token via Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/checklist', [ChecklistItemController::class, 'store']);
    Route::put('/checklist/{checklistItem}', [ChecklistItemController::class, 'update']);
    Route::delete('/checklist/{checklistItem}', [ChecklistItemController::class, 'destroy']);

    Route::apiResource('users', UserController::class)->except(['show']);

    Route::get('/projects/{project}/chat', [ChatController::class, 'index']);
    Route::post('/projects/{project}/chat', [ChatController::class, 'store']);
    Route::delete('/chat/{chatMessage}', [ChatController::class, 'destroy']);

    Route::apiResource('announcements', AnnouncementController::class)->except(['show']);

    // Master Data — {type} is one of: taskStatuses, priorities, projectStatuses, labels, departments, jobTitles
    Route::get('/master-data/{type}', [MasterDataController::class, 'index']);
    Route::post('/master-data/{type}', [MasterDataController::class, 'store']);
    Route::put('/master-data/{type}/{id}', [MasterDataController::class, 'update']);
    Route::delete('/master-data/{type}/{id}', [MasterDataController::class, 'destroy']);
    Route::post('/master-data/{type}/{id}/move', [MasterDataController::class, 'move']);
});
