<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin    = Role::create(['name' => 'admin']);
        $manager  = Role::create(['name' => 'manager']);
        $cashier  = Role::create(['name' => 'cashier']);
        $guardian = Role::create(['name' => 'guardian']);

        // 2. Buat Pengguna Admin Awal (penting untuk login pertama)
        $user = User::create([
            'name'     => 'Super Admin',
            'email'    => 'admin@bumtren.com',
            'password' => bcrypt('password'), // Ganti dengan password yang aman
        ]);

        // 3. Berikan role 'admin' ke user tersebut
        $user->assignRole($admin);

    }
}