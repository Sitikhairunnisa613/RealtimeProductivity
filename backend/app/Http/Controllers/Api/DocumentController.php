<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\DocumentLog;

class DocumentController extends Controller
{
    // =============================
    // Dokumen milik user
    // =============================
    public function index(Request $request)
    {
        return $request->user()
            ->documents()
            ->latest()
            ->get();
    }

    // =============================
    // Dokumen yang dibagikan
    // =============================
    public function shared(Request $request)
    {
        return $request->user()
            ->sharedDocuments()
            ->with('user')
            ->latest()
            ->get();
    }

    // =============================
    // Membuat dokumen
    // =============================
    public function store(Request $request)
    {
        $document = Document::create([
            'user_id' => $request->user()->id,
            'title' => 'Untitled Document',
            'content' => ''
        ]);

        DocumentLog::create([
            'document_id'=>$document->id,
            'user_name'=>$request->user()->name,
            'activity'=>'Membuat dokumen'
        ]);

        return response()->json([
            'message' => 'Document berhasil dibuat',
            'document' => $document
        ]);
    }

    // =============================
    // Cek hak akses
    // =============================
    private function hasAccess(Request $request, Document $document)
    {
        if ($document->user_id == $request->user()->id) {
            return true;
        }

        return $document
            ->collaborators()
            ->where('user_id', $request->user()->id)
            ->exists();
    }

    // =============================
    // Detail dokumen
    // =============================
    public function show(Request $request, Document $document)
    {
        if (!$this->hasAccess($request, $document)) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        return response()->json($document);
    }

    // =============================
    // Update dokumen
    // =============================
    public function update(Request $request, Document $document)
    {
        if (!$this->hasAccess($request, $document)) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        $request->validate([
            'title' => 'required',
            'content' => 'nullable'
        ]);

        $document->update([
            'title' => $request->title,
            'content' => $request->content
        ]);

        DocumentLog::create([
            'document_id'=>$document->id,
            'user_name'=>$request->user()->name,
            'activity'=>'Mengedit dokumen'
        ]);

        return response()->json([
            'message' => 'Document berhasil diupdate'
        ]);
    }

    // =============================
    // Hapus dokumen
    // =============================
    public function destroy(Request $request, Document $document)
    {
        if ($document->user_id != $request->user()->id) {
            return response()->json([
                'message' => 'Hanya pemilik yang dapat menghapus dokumen.'
            ], 403);
        }

        $document->delete();

        return response()->json([
            'message' => 'Document berhasil dihapus'
        ]);
    }

    // =============================
// Share dokumen
// =============================
public function share(Request $request, Document $document)
{
    if ($document->user_id != $request->user()->id) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    $request->validate([
        'email' => 'required|email'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => 'User tidak ditemukan'
        ], 404);
    }

    if ($user->id == $request->user()->id) {
        return response()->json([
            'message' => 'Tidak bisa share ke diri sendiri'
        ], 400);
    }

    $document->collaborators()->syncWithoutDetaching([$user->id]);

    DocumentLog::create([
        'document_id' => $document->id,
        'user_name' => $request->user()->name,
        'activity' => 'Membagikan dokumen ke ' . $user->name
    ]);

    return response()->json([
        'message' => 'Dokumen berhasil dibagikan'
    ]);
}
    // =============================
    // Riwayat aktivitas dokumen
    // =============================
    public function logs(Request $request, Document $document)
    {
        if (!$this->hasAccess($request, $document)) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        return DocumentLog::where(
            'document_id',
            $document->id
        )
        ->latest()
        ->take(20)
        ->get();
    }
}