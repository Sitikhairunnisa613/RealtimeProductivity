<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocumentLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'user_name',
        'activity'
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}