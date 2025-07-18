<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder {
    public function run(): void {
        $pages = [
            ['name' => 'النقدية', 'route' => 'money.php', 'icon_class' => 'fas fa-wallet'],
            ['name' => 'الأجهزة', 'route' => 'devices.php', 'icon_class' => 'fas fa-desktop'],
            ['name' => 'التربيزات', 'route' => 'tables.php', 'icon_class' => 'fas fa-table'],
            ['name' => 'الأوردرات', 'route' => 'orders.php', 'icon_class' => 'fas fa-shopping-cart'],
            ['name' => 'المخزن والأسعار', 'route' => 'inventory.php', 'icon_class' => 'fas fa-boxes'],
            ['name' => 'العملاء', 'route' => 'customer.php', 'icon_class' => 'fas fa-users'],
            ['name' => 'الموظفين', 'route' => 'employees.php', 'icon_class' => 'fas fa-user-tie'],
            ['name' => 'الإعدادات', 'route' => 'setting.php', 'icon_class' => 'fas fa-cog'],
            ['name' => 'التقارير', 'route' => 'reports.php', 'icon_class' => 'fas fa-chart-bar'],
        ];
        foreach ($pages as $page) { Page::firstOrCreate(['route' => $page['route']], $page); }
    }
}