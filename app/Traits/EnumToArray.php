<?php

namespace App\Traits;

trait EnumToArray
{
    public static function toArray(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
