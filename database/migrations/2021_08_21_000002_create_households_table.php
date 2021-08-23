<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHouseholdsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('households', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('last_name');
            $table->unsignedBigInteger('husband_id')->nullable()->unique();
            $table->foreign('husband_id')->references('id')->on('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('wife_id')->nullable()->unique();
            $table->foreign('wife_id')->references('id')->on('individuals')->onDelete('cascade');
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
        Schema::dropIfExists('households');
    }
}
