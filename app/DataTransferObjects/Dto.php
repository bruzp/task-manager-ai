<?php

namespace App\DataTransferObjects;

abstract readonly class Dto
{
    abstract public function toArray(): array;
}
