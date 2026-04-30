<?php

namespace App\Models\Concerns;

trait HasActivityDisplay
{
    /**
     * Return a human readable label for activity logs.
     * Override this in a model if you want custom text.
     *
     * e.g. return "{$this->title}";
     */
    public function activityDisplayName(): string
    {
        // fallback common fields
        foreach (['title', 'name', 'email'] as $field) {
            if (isset($this->{$field}) && $this->{$field} !== null && $this->{$field} !== '') {
                return (string) $this->{$field};
            }
        }

        // fallback to model class and id
        return class_basename($this) . " #{$this->getKey()}";
    }
}
