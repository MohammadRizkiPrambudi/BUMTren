<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GuardianController as AdminGuardian;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Guardian\GuardianController;
use App\Http\Controllers\Pos\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('students', StudentController::class)->names('students');
        Route::resource('units', UnitController::class)->names('units');
        Route::resource('products', ProductController::class)->names('products');
        Route::resource('categories', CategoryController::class)->names('categories');
        Route::resource('stocks', StockController::class)->names('stocks');
        Route::resource('users', UserController::class)->names('users');
        Route::resource('guardians', AdminGuardian::class)->names('guardians');
    });

    Route::get('/admin/product/search', [StockController::class, 'getProducts'])->name('admin.stocks.products.search');

    Route::prefix('kasir')->name('pos.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::post('/order', [OrderController::class, 'store'])->name('store');
        Route::get('/search/santri', [OrderController::class, 'searchSantri'])->name('search.santri');
        Route::get('/products', [OrderController::class, 'getUnitProducts'])->name('products');
        Route::post('sync-orders', [OrderController::class, 'syncOrders'])->name('sync.orders');
    });

    Route::prefix('orang-tua')->name('guardian.')->group(function () {
        Route::get('dashboard', [GuardianController::class, 'index'])->name('dashboard');
        Route::get('topup', [GuardianController::class, 'topupForm'])->name('topup.form');
        // Route::post('topup/process', [GuardianController::class, 'processTopup'])->name('guardian.topup.process');
    });

    // Route::post('/tripay/callback', [PaymentController::class, 'tripayCallback'])->name('tripay.callback');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
