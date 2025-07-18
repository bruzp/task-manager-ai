<?php

namespace App\Enum;

use App\Traits\EnumToArray;

enum StatusEnum: string
{
    use EnumToArray;

    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
}
