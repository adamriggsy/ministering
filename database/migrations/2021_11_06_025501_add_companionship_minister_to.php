<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanionshipMinisterTo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('minister_to', function (Blueprint $table) {
            $table->unsignedBigInteger('companionship_id')->nullable()->after('household_id');
            $table->foreign('companionship_id')->references('id')->on('companionships')->onDelete('cascade');
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
            $table->dropColumn('companionship_id');
        });
    }
}
