<?php

namespace App\Observers;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityObserver
{
    /**
     * Cegah infinite loop & logging duplikat.
     */
    protected function isActivityLogModel(Model $model): bool
    {
        return $model instanceof ActivityLog;
    }

    protected function actorId()
    {
        return optional(Auth::user())->getKey();
    }

    protected function actorName(): string
    {
        return optional(Auth::user())->name ?? 'System';
    }

    /**
     * Menentukan nama entity (subject) yang dilacak.
     */
    protected function subjectDisplay(Model $model): string
    {
        if (method_exists($model, 'activityDisplayName')) {
            return $model->activityDisplayName();
        }

        foreach (['title', 'name', 'email'] as $field) {
            if (!empty($model->{$field})) {
                return (string) $model->{$field};
            }
        }

        return class_basename($model) . " #{$model->getKey()}";
    }

    /**
     * Buat ringkasan perubahan sederhana (old/new diff).
     */
    protected function shortChanges(array $old, array $new): array
    {
        $diffOld = [];
        $diffNew = [];

        foreach ($new as $key => $value) {
            // Lewati field non-relevan
            if (in_array($key, ['updated_at', 'created_at', 'deleted_at'])) continue;

            $oldVal = $old[$key] ?? null;
            if ($oldVal != $value) {
                $diffOld[$key] = $oldVal;
                $diffNew[$key] = $value;
            }
        }

        return ['old' => $diffOld ?: null, 'new' => $diffNew ?: null];
    }

    /**
     * Buat kalimat deskripsi aktivitas.
     */
    protected function buildDescription(string $action, Model $model, ?array $changes = null): string
    {
        $actor = $this->actorName();
        $modelName = class_basename($model);
        $subject = $this->subjectDisplay($model);

        return match ($action) {
            'created' => "{$actor} membuat {$modelName} \"{$subject}\"",
            'deleted' => "{$actor} menghapus {$modelName} \"{$subject}\"",
            'updated' => $this->buildUpdateDescription($actor, $modelName, $subject, $changes),
            default => "{$actor} melakukan {$action} pada {$modelName} \"{$subject}\"",
        };
    }

    protected function buildUpdateDescription(string $actor, string $modelName, string $subject, ?array $changes = null): string
    {
        if ($changes && !empty($changes['old'])) {
            $pairs = [];
            foreach ($changes['old'] as $k => $oldVal) {
                $newVal = $changes['new'][$k] ?? null;
                $pairs[] = "{$k}: {$oldVal} → {$newVal}";
            }
            $pairsText = implode(', ', $pairs);
            return "{$actor} memperbarui {$modelName} \"{$subject}\" ({$pairsText})";
        }

        return "{$actor} memperbarui {$modelName} \"{$subject}\"";
    }

    /**
     * EVENT: CREATED
     */
    public function created(Model $model)
    {
        if ($this->isActivityLogModel($model)) return;

        // Pastikan hanya log saat benar-benar baru dibuat
        if (!$model->wasRecentlyCreated) return;

        $changes = $this->shortChanges([], $model->getAttributes());

        $this->storeLog('created', $model, $changes);
    }

    /**
     * EVENT: UPDATED
     */
    public function updated(Model $model)
    {
        if ($this->isActivityLogModel($model)) return;

        // ⛔ Skip jika update terjadi langsung setelah create (beda < 2 detik)
        $createdAt = $model->getOriginal('created_at');
        $updatedAt = $model->getAttribute('updated_at');

        if ($createdAt && $updatedAt && abs(strtotime($updatedAt) - strtotime($createdAt)) < 2) {
            return; // jangan log update ganda
        }

        $original = $model->getOriginal();
        $attributes = $model->getAttributes();
        $changes = $this->shortChanges($original, $attributes);

        if (empty($changes['old'])) return;

        $this->storeLog('updated', $model, $changes);
    }

    /**
     * EVENT: DELETED
     */
    public function deleted(Model $model)
    {
        if ($this->isActivityLogModel($model)) return;

        $changes = $this->shortChanges($model->getAttributes(), []);

        $this->storeLog('deleted', $model, $changes);
    }

    /**
     * Simpan log ke database.
     */
protected function storeLog(string $action, Model $model, ?array $changes = null): void
{
    try {
        $exists = ActivityLog::where('subject_type', get_class($model))
            ->where('subject_id', $model->getKey())
            ->where('action', $action)
            ->where('user_id', $this->actorId())
            ->whereBetween('created_at', [now()->subSeconds(2), now()])
            ->exists();

        if ($exists) {
            // 🚫 Jangan simpan duplikat dalam 2 detik terakhir
            return;
        }

        ActivityLog::create([
            'subject_type' => get_class($model),
            'subject_id'   => $model->getKey(),
            'user_id'      => $this->actorId(),
            'action'       => $action,
            'description'  => $this->buildDescription($action, $model, $changes),
            'changes'      => $changes,
            'ip'           => Request::ip(),
            'user_agent'   => Request::userAgent(),
        ]);
    } catch (\Throwable $e) {
        \Log::warning("ActivityLog gagal disimpan: " . $e->getMessage());
    }
}


    /**
     * Daftarkan semua model yang ingin dilacak.
     */
    public static function observeAllModels(): void
    {
        $models = [
            \App\Models\User::class,
            \App\Models\Project::class,
            \App\Models\Sprint::class,
            \App\Models\Task::class,
            \App\Models\ProjectMember::class,
        ];

        foreach ($models as $model) {
            $model::observe(static::class);
        }
    }
}
