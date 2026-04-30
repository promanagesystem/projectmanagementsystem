
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    DashboardController,
    ProjectController,
    ProjectMemberController,
    UserController,
    SprintController,
    TaskController,
    ActivityLogController,
    ReportController,
    AttachmentController,
    SubTaskController,
    ProjectDetailController,
    FinanceController,
    GlobalFinanceController,
    GeneralExpenseController,
    RoleWorkflowController,
    RoleResponsibilityController,
    FinanceAttachmentController
};
use App\Models\ActivityLog;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Auth)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    /*
    |--------------------------------------------------------------------------
    | Projects & Members
    |--------------------------------------------------------------------------
    */
    Route::resource('projects', ProjectController::class);

    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])
        ->name('projects.members.store');

    /*
    |--------------------------------------------------------------------------
    | Sprints
    |--------------------------------------------------------------------------
    */
    Route::resource('projects.sprints', SprintController::class);

    /*
    |--------------------------------------------------------------------------
    | Tasks (Project & Sprint based)
    |--------------------------------------------------------------------------
    */
    // Task CRUD (independent of sprint)
    Route::resource('projects.tasks', TaskController::class);

    // Task CRUD inside sprint context
    Route::resource('projects.sprints.tasks', TaskController::class);

    // Update task status
    Route::patch('/projects/{project}/tasks/{task}/update-status', [TaskController::class, 'updateStatus'])
        ->name('projects.tasks.updateStatus');

    // My Tasks
    Route::get('/my-tasks', [TaskController::class, 'myTasks'])->name('tasks.my');

    /*
    |--------------------------------------------------------------------------
    | Subtasks
    |--------------------------------------------------------------------------
    */
    Route::post('/projects/{project}/tasks/{task}/subtasks', [SubTaskController::class, 'store'])
        ->name('projects.sprints.tasks.subtasks.store');

    Route::patch('/subtasks/{subtask}/status', [SubTaskController::class, 'updateStatus'])
        ->name('projects.sprints.tasks.subtasks.updateStatus');

    Route::delete('/subtasks/{subtask}', [SubTaskController::class, 'destroy'])
        ->name('projects.sprints.tasks.subtasks.destroy');

    /*
    |--------------------------------------------------------------------------
    | Attachments (Project & Task)
    |--------------------------------------------------------------------------
    */

// --- Attachment untuk PROJECT ---
Route::get('projects/{project}/attachments', [AttachmentController::class, 'indexProject'])
    ->name('attachments.project.index');

Route::post('projects/{project}/attachments', [AttachmentController::class, 'storeProject'])
    ->name('attachments.storeProject');

Route::delete('projects/{project}/attachments/{attachment}', [AttachmentController::class, 'destroyProject'])
    ->name('attachments.project.destroy');

// Task-level attachments
Route::get('projects/{project}/tasks/{task}/attachments', [AttachmentController::class, 'index'])
    ->name('attachments.index');
Route::post('projects/{project}/tasks/{task}/attachments', [AttachmentController::class, 'store'])
    ->name('attachments.store');

// Delete (dua versi)
Route::delete('projects/{project}/tasks/{task}/attachments/{attachment}', [AttachmentController::class, 'destroy'])
    ->name('attachments.destroy');
Route::delete('projects/{project}/attachments/{attachment}', [AttachmentController::class, 'destroyProject'])
    ->name('attachments.destroyProject');


    /*
    |--------------------------------------------------------------------------
    | Activity Logs
    |--------------------------------------------------------------------------
    */
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])
        ->name('activity.logs.index');

    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */
    Route::get('/report', [ReportController::class, 'index'])->name('projects.reports.showAll');
    Route::get('/report/{project}', [ReportController::class, 'show'])->name('projects.reports.show');
    Route::post('/report/generate', [ReportController::class, 'generate'])->name('projects.reports.generate');

    /*
    |--------------------------------------------------------------------------
    | User Management
    |--------------------------------------------------------------------------
    */
    Route::resource('users', UserController::class);
});

    /*
    |--------------------------------------------------------------------------
    | Project Details Routes
    |--------------------------------------------------------------------------
    */
Route::prefix('projects/{project}')->group(function () {
    Route::get('details/create', [ProjectDetailController::class, 'create'])->name('projects.details.create');
    Route::post('details', [ProjectDetailController::class, 'store'])->name('projects.details.store');

    Route::get('details', [ProjectDetailController::class, 'show'])->name('projects.details.show');
    Route::get('details/edit', [ProjectDetailController::class, 'edit'])->name('projects.details.edit');

    // ✅ cukup ini aja
    Route::match(['put', 'patch'], 'details', [ProjectDetailController::class, 'update'])
        ->name('projects.details.update');
});



/*|--------------------------------------------------------------------------  
| Finance Routes  
|--------------------------------------------------------------------------*/  
Route::middleware(['auth'])->prefix('finance')->group(function () {

    // 🔹 GLOBAL OVERVIEW — semua proyek
    Route::get('/', [GlobalFinanceController::class, 'index'])->name('finance.global');

    /*
    |--------------------------------------------------------------------------
    | PROJECT-LEVEL FINANCE
    |--------------------------------------------------------------------------
    */
    Route::prefix('projects/{project}')->group(function () {

        Route::get('/', [FinanceController::class, 'index'])->name('finance.index');

        // Income CRUD
        Route::post('/income', [FinanceController::class, 'storeIncome'])->name('finance.storeIncome');
        Route::delete('/income/{income}', [FinanceController::class, 'destroyIncome'])->name('finance.destroyIncome');

        // Expense CRUD
        Route::post('/expense', [FinanceController::class, 'storeExpense'])->name('finance.storeExpense');
        Route::delete('/expense/{expense}', [FinanceController::class, 'destroyExpense'])->name('finance.destroyExpense');

        /*
        |--------------------------------------------------------------------------
        | FINANCE ATTACHMENTS (PROJECT)
        |--------------------------------------------------------------------------
        */
        Route::post('/income/{income}/attachment', 
            [FinanceAttachmentController::class, 'storeIncome'])
            ->name('finance.attachIncome');

        Route::post('/expense/{expense}/attachment', 
            [FinanceAttachmentController::class, 'storeExpense'])
            ->name('finance.attachExpense');
    });

    /*
    |--------------------------------------------------------------------------
    | GENERAL EXPENSES
    |--------------------------------------------------------------------------
    */
    Route::get('/general', [GeneralExpenseController::class, 'index'])->name('general-expense.index');
    Route::post('/general', [GeneralExpenseController::class, 'store'])->name('general-expense.store');
    Route::delete('/general/{generalExpense}', [GeneralExpenseController::class, 'destroy'])->name('general-expense.destroy');

    /*
    |--------------------------------------------------------------------------
    | GENERAL EXPENSE ATTACHMENT
    |--------------------------------------------------------------------------
    */
    Route::post('/general/{generalExpense}/attachment',
        [FinanceAttachmentController::class, 'storeGeneral'])
        ->name('finance.general.attach');

    /*
    |--------------------------------------------------------------------------
    | DELETE ATTACHMENT (GLOBAL)
    |--------------------------------------------------------------------------
    */
    Route::delete('/attachment/{attachment}', 
        [FinanceAttachmentController::class, 'destroy'])
        ->name('finance.attachment.destroy');

 /*
        |--------------------------------------------------------------------------  
        | GENERAL ATTACHMENTS — TERTAUT KE PROJECT SAJA
        |--------------------------------------------------------------------------  
        */
Route::post('/project/{project}/general-upload',
    [FinanceAttachmentController::class, 'storeGeneralProject']
)->name('finance.generalUpload');

});


    /*|--------------------------------------------------------------------------
    | Role Workflows Routes
    |--------------------------------------------------------------------------*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/role-workflows', [RoleWorkflowController::class, 'index'])->name('role-workflows.index');
    Route::get('/role-workflows/create', [RoleWorkflowController::class, 'create'])->name('role-workflows.create'); // ✅ Tambah ini
    Route::post('/role-workflows', [RoleWorkflowController::class, 'store'])->name('role-workflows.store');
    Route::get('/role-workflows/{id}/edit', [RoleWorkflowController::class, 'edit'])->name('role-workflows.edit'); // ✅ optional
    Route::put('/role-workflows/{id}', [RoleWorkflowController::class, 'update'])->name('role-workflows.update');
    Route::delete('/role-workflows/{id}', [RoleWorkflowController::class, 'destroy'])->name('role-workflows.destroy');
});

/*|--------------------------------------------------------------------------
| Role Responsibilities Routes
|--------------------------------------------------------------------------*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/role-responsibilities', [RoleResponsibilityController::class, 'index'])->name('role-responsibilities.index');
    Route::get('/role-responsibilities/create', [RoleResponsibilityController::class, 'create'])->name('role-responsibilities.create'); // ✅ Tambah ini
    Route::post('/role-responsibilities', [RoleResponsibilityController::class, 'store'])->name('role-responsibilities.store');
    Route::get('/role-responsibilities/{id}/edit', [RoleResponsibilityController::class, 'edit'])->name('role-responsibilities.edit'); // ✅ optional
    Route::put('/role-responsibilities/{id}', [RoleResponsibilityController::class, 'update'])->name('role-responsibilities.update');
    Route::delete('/role-responsibilities/{id}', [RoleResponsibilityController::class, 'destroy'])->name('role-responsibilities.destroy');
});

// Export PDF Report
Route::get('/reports/{project}/export-pdf', [ReportController::class, 'exportPdf'])
    ->name('reports.export.pdf');
/*
|--------------------------------------------------------------------------
| Additional Files
|--------------------------------------------------------------------------
*/
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
