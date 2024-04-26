import { useState, useEffect } from 'react';

function InputDate({ setDob }) {

    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(1999);
    const [maxDay, setMaxDay] = useState(30);

    const isLeapYear = (year) => {
        return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
    };

    useEffect(() => {
        if (month === 2) {
            if (isLeapYear(year)) {
                setMaxDay(29);
            } else {
                setMaxDay(28);
            }
        } else if ([4, 6, 9, 11].includes(month)) {
            setMaxDay(30);
        } else {
            setMaxDay(31);
        }
    }, [month, year]);

    const onDayChange = (e) => {
        setDay(parseInt(e.target.value, 10));
    };

    const onMonthChange = (e) => {
        setMonth(parseInt(e.target.value, 10));
    };

    const onYearChange = (e) => {
        setYear(parseInt(e.target.value, 10));
    };

    useEffect(() => {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setDob(date);
    }, [day, month, year, setDob]);

    const days = Array.from({ length: maxDay }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 101 }, (_, i) => 2023 - i);

    return (
        <div className="w-full flex justify-around items-center">
            <div className="flex flex-col gap-1 w-16 bg-white justify-around items-center">
                <label className="text-gray-500">Day</label>
                <select value={day} onChange={onDayChange} className="select select-bordered select-sm bg-white">
                    {days.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1 w-16 bg-white justify-around items-center">
                <label className="text-gray-500">Month</label>
                <select value={month} onChange={onMonthChange} className="select select-bordered select-sm bg-white">
                    {months.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1 w-16 bg-white justify-around items-center">
                <label className="text-gray-500">Year</label>
                <select value={year} onChange={onYearChange} className="select select-bordered select-sm bg-white">
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default InputDate;
