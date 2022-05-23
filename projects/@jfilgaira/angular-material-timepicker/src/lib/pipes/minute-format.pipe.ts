import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteFormat'
})
export class MinuteFormatPipe implements PipeTransform
{

    transform(value: number): string
    {
        const _value = value.toString();
        return _value.length == 1 ? `0${ _value }` : _value;
    }

}
