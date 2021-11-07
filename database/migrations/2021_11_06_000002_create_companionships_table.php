<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanionshipsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companionships', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('companion_1')->nullable();
            $table->foreign('companion_1')->references('id')->on('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('companion_2')->nullable();
            $table->foreign('companion_2')->references('id')->on('individuals')->onDelete('cascade');
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
        Schema::dropIfExists('companionships');
    }
}
