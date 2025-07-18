<?php

namespace App\Enum;

use App\Traits\EnumToArray;

enum PriorityEnum: string
{
    use EnumToArray;

    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
}
