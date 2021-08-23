<?php

namespace Database\Factories;

use App\Models\Individuals;
use Illuminate\Database\Eloquent\Factories\Factory;

class IndividualsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Individuals::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'no_contact']),
        ];
    }
}
