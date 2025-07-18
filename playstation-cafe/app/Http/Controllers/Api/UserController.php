<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index() {
        return response()->json(User::all());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:admin,employee'],
            'pages' => ['sometimes', 'array']
        ]);
        $user = User::create($validated);
        if (isset($validated['pages'])) {
            $user->pages()->sync($validated['pages']);
        }
        return response()->json($user, 201);
    }

    public function show(User $user) {
        return response()->json($user->load('pages'));
    }

    public function update(Request $request, User $user) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
            'role' => ['required', 'in:admin,employee'],
            'pages' => ['sometimes', 'array']
        ]);
        $user->update($validated);
        if (isset($validated['pages'])) {
            $user->pages()->sync($validated['pages']);
        }
        return response()->json($user->load('pages'));
    }

    public function destroy(User $user) {
        if ($user->role === 'admin' && User::where('role', 'admin')->count() === 1) {
            return response()->json(['message' => 'لا يمكن حذف آخر مسؤول في النظام.'], 403);
        }
        $user->delete();
        return response()->json(null, 204);
    }
}