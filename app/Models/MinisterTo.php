<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MinisterTo extends Model
{
    protected $table = 'minister_to';

    public function household() {
        return $this->belongsTo(Households::class);
    }

    public function individual() {
        return $this->belongsTo(Individuals::class);
    }

    /**
     * Relationship: comments
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function comments()
    {
        return $this->morphMany(Comments::class, 'commentable');
    }
}
