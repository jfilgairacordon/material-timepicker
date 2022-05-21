import { HourFormatPipe } from './hour-format.pipe';

describe('HourFormatPipe', () =>
{
    it('create an instance', () =>
    {
        const pipe = new HourFormatPipe();
        expect(pipe).toBeTruthy();
    });

    it('should format 1 to 01', () =>
    {
        const pipe = new HourFormatPipe();
        const formatted = pipe.transform(1);
        expect(formatted).toBe("01");
    });

    it('should format 0 to 00', () =>
    {
        const pipe = new HourFormatPipe();
        const formatted = pipe.transform(0);
        expect(formatted).toBe("00");
    });

    it('should format 59 to 59', () =>
    {
        const pipe = new HourFormatPipe();
        const formatted = pipe.transform(59);
        expect(formatted).toBe("59");
    });
});
