import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hourFormat'
})
export class HourFormatPipe implements PipeTransform
{
    transform(value: number): string
    {
        const _value = value ? value.toString() : "00";
        return _value.length == 1 ? `0${ _value }` : _value;
    }
}
