import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Divider,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useOutsideClick
} from "@chakra-ui/react";
import { normalizeEventKey } from "@chakra-ui/utils";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const removeEmptyWeeks = (week) => week.length;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const isValidDate = (date) => date instanceof Date && !isNaN(date);

const getWeeksForMonthAndYear = (year, monthNumber) => {
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const daysInPrevMonth = new Date(year, monthNumber - 1, 0).getDate();

  const allDays = Array(daysInMonth)
    .fill()
    .map((_, idx) => ({
      enabled: true,
      date: new Date(year, monthNumber - 1, idx + 1)
    }));

  const allWeeks = allDays.reduce(
    (weeks, day) => {
      if (day.date.getDay() === 0) {
        return [...weeks, [day]];
      }

      const tmpWeeks = weeks;
      tmpWeeks[tmpWeeks.length - 1].push(day);

      return tmpWeeks;
    },
    [[]]
  );

  const filledWeeks = allWeeks.filter(removeEmptyWeeks).map((week) => {
    const firstDay = week[0].date.getDay();
    const lastDay = week[week.length - 1].date.getDay();

    if (firstDay !== 0) {
      const fillFrontArray = Array(firstDay)
        .fill()
        .map((_, idx) => ({
          enabled: false,
          date: new Date(year, monthNumber - 2, daysInPrevMonth - idx)
        }));
      return [...fillFrontArray.reverse(), ...week];
    }

    if (lastDay !== 6) {
      const fillBackArray = Array(6 - lastDay)
        .fill()
        .map((_, idx) => ({
          enabled: false,
          date: new Date(year, monthNumber, idx + 1)
        }));

      return [...week, ...fillBackArray];
    }

    return week;
  });

  return filledWeeks;
};

const getCurrentMonthYear = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();

  return { month, year };
};

const getCurrentDate = () => new Date();

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getVariant = (date, selectedDate, enabled) => {
  const isDaySelected = datesAreOnSameDay(date, selectedDate);
  if (enabled && isDaySelected) {
    return "solid";
  }

  return "ghost";
};

const getColorScheme = (colorScheme, enabled, day, selectedDay) => {
  const isDaySelected = datesAreOnSameDay(day, selectedDay);
  if (!enabled || !isDaySelected) {
    return "gray";
  }

  return colorScheme;
};

const getDateObject = (date, inputValue = "", inputTouched = false) => {
  return {
    rawDate: date,
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    day: date.getDate(),
    inputValue,
    inputTouched
  };
};

const getInputValue = (date) => {
  const { day, month, year, inputValue, inputTouched } = date;

  if (inputValue || inputTouched) {
    return inputValue;
  }

  const value = `${month}/${day}/${year}`;

  return value;
};

// Component

const DatePicker = ({
  colorScheme = "blue",
  minYear = 1500,
  maxYear = new Date().getFullYear(),
  id,
  onDateChange,
  onChange = (e) => {console.log("SSEEE:"+JSON.stringify(e))}
}) => {
  const [currentMonthYear, setCurrentMonthYear] = useState(() =>
    getCurrentMonthYear()
  );
  const { onOpen, onClose, isOpen } = useDisclosure();
  const inputRef = useRef();
  const calendarRef = useRef();
  const gridRef = useRef();
  

  useOutsideClick({
    ref: inputRef,
    handler: (event) => {
      if (
        event.target.contains(calendarRef.current) &&
        event.target !== inputRef.current
      ) {
        onClose();
      }
    }
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    getDateObject(getCurrentDate())
  );

  const updateSelectedDate = (date) => {
    setSelectedDate(getDateObject(date));
  };

  const incrementMonth = () => {
    setCurrentMonthYear((prev) => ({
      year: prev.month === 12 ? prev.year + 1 : prev.year,
      month: prev.month < 12 ? prev.month + 1 : 1
    }));
  };

  const decrementMonth = () => {
    setCurrentMonthYear((prev) => ({
      year: prev.month > 1 ? prev.year : prev.year - 1,
      month: prev.month > 1 ? prev.month - 1 : 12
    }));
  };

  const handleInputChange = (e) => {
    console.log("inputValue::inputValue:::"+e)
    setSelectedDate((prev) => {
      const inputValue = e.target.value;

      
      const [month, day, year] = inputValue.split("/");
      const newDate = new Date(year, month - 1, day);
      const yearIsLong = year && year.length === 4;
      const yearMinMax = Number(year) >= minYear && Number(year) <= maxYear;

      if (
        isValidDate(newDate) &&
        month &&
        day &&
        year &&
        yearIsLong &&
        yearMinMax
      ) {
        return getDateObject(newDate, inputValue, true);
      }

      return {
        ...prev,
        inputValue: e.target.value,
        inputTouched: true
      };
    });
  };

  const handleKeyboardInteractions = useCallback((e) => {
    const key = normalizeEventKey(e);
    const children = Array.from(e.target.parentNode.children);
    const targetIndex = children.indexOf(e.target);

    if (key === "ArrowRight") {
      const nodeToBeFocused = e.target.nextElementSibling;
      if (nodeToBeFocused.disabled) {
        incrementMonth();
      } else {
        nodeToBeFocused.focus();
      }
    }

    if (key === "ArrowLeft") {
      const nodeToBeFocused = e.target.previousElementSibling;
      if (nodeToBeFocused.disabled) {
        decrementMonth();
      } else {
        nodeToBeFocused.focus();
      }
    }

    if (key === "ArrowDown") {
      const nodeToBeFocused = children[targetIndex + 7];
      if (!nodeToBeFocused || nodeToBeFocused.disabled) {
        incrementMonth();
      } else {
        nodeToBeFocused.focus();
      }
    }

    if (key === "ArrowUp") {
      const nodeToBeFocused = children[targetIndex - 7];
      if (!nodeToBeFocused || nodeToBeFocused.disabled) {
        decrementMonth();
      } else {
        nodeToBeFocused.focus();
      }
    }
  }, []);

  useEffect(() => {
    setCurrentMonthYear({ month: selectedDate.month, year: selectedDate.year });
  }, [selectedDate, setCurrentMonthYear]);

  useEffect(() => {
    onChange({ date: selectedDate.rawDate });
  }, [onChange, selectedDate]);

  useEffect(() => {
    const calenderNode = gridRef.current;
    calenderNode.addEventListener("keydown", handleKeyboardInteractions);

    return () =>
      calenderNode.removeEventListener("keydown", handleKeyboardInteractions);
  }, [handleKeyboardInteractions]);

  return (
    <Popover
      isOpen={isOpen}
      autoFocus={false}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Input
          ref={inputRef}
          size="md"
          value={getInputValue(selectedDate)}
          onChange={handleInputChange}
        />
      </PopoverTrigger>
      <PopoverContent onClick={(e) => e.stopPropagation()}>
        <PopoverBody p={2}>
          <Box maxWidth="500px" bg="transparent" ref={calendarRef}>
            <Center justifyContent="space-between" as="nav" padding={2}>
              <IconButton
                onClick={decrementMonth}
                icon={<RiArrowLeftSLine />}
              />
              {months[currentMonthYear.month - 1]}, {currentMonthYear.year}
             <IconButton
                onClick={incrementMonth}
                icon={<RiArrowRightSLine />}
              />
            </Center>
            <Divider />
            <Grid templateColumns="repeat(7, 1fr)" gap={1} ref={gridRef}>
              {days.map((day) => (
                <GridItem
                  as={Flex}
                  justifyContent="center"
                  fontWeight="bold"
                  key={day}
                  p={2}
                >
                  {day}
                </GridItem>
              ))}
            </Grid>
            <Grid templateColumns="repeat(7, 1fr)" gap={1} ref={gridRef}>
              {getWeeksForMonthAndYear(
                currentMonthYear.year,
                currentMonthYear.month
              ).map((week) =>
                week.map((day) => (
                  <GridItem
                    as={Button}
                    isDisabled={!day.enabled}
                    variant={getVariant(
                      day.date,
                      selectedDate.rawDate,
                      day.enabled
                    )}
                    colorScheme={getColorScheme(
                      colorScheme,
                      day.enabled,
                      day.date,
                      selectedDate.rawDate
                    )}
                    key={`${day.date.getDate()}-${day.date.getMonth()}`}
                    p={0}
                    m={0}
                    onClick={() => updateSelectedDate(day.date)}
                  >
                    {day.date.getDate()}
                  </GridItem>
                ))
              )}
            </Grid>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
