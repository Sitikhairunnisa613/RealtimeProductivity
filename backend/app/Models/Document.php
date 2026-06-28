<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content'
    ];

    protected $appends = [
        'owner_name',
        'last_edited'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class);
    }

    public function logs()
    {
    return $this->hasMany(DocumentLog::class)
        ->latest();
    }

    public function getOwnerNameAttribute()
    {
        return $this->user?->name;
    }

    public function getLastEditedAttribute()
    {
        return $this->updated_at
            ? $this->updated_at->format('d M Y H:i')
            : "-";
    }
}