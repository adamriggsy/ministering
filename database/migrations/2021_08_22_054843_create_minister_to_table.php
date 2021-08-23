<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMinisterToTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('minister_to', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('individual_id')->nullable();
            $table->foreign('individual_id')->references('id')->on('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('household_id')->nullable();
            $table->foreign('household_id')->references('id')->on('households')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('minister_to');
    }
}
