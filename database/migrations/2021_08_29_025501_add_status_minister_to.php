<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusMinisterTo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('minister_to', function (Blueprint $table) {
            $table->enum('status', ['approved', 'rejected', 'proposed'])->default('proposed')->after('household_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('minister_to', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
