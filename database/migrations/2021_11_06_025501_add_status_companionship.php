<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusCompanionship extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('companionships', function (Blueprint $table) {
            $table->enum('status', ['approved', 'rejected', 'proposed'])->default('proposed')->after('companion_2');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('companionships', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
