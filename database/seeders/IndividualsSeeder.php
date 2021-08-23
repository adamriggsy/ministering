<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Individuals;

class IndividualsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Individuals::factory()
        	->count(20)
        	->create();
    }
}
