import { ContainerInput, DatePicker, Label } from "@/components";
import { TimePicker } from "@/components";

interface Props {
  legend: string;
  labelDate: string;
  labelTime: string;
  date: Date | undefined;
  handleDate: (key: KeyDate, date: Date | undefined) => void;
  dateKey: KeyDate;
  time: string;
  timeKey: KeyTime;
  handleTime: (key: KeyTime, time: string) => void;
}

type KeyDate = "initialDate" | "endDate";
type KeyTime = "initialTime" | "endTime";

export const DateAndTimeInputs = (props: Props) => {
  const {
    legend,
    labelDate,
    labelTime,
    date,
    dateKey,
    handleDate,
    time,
    timeKey,
    handleTime,
  } = props;

  return (
    <fieldset className="border border-gray-300 p-4 relative bg-slate-50 rounded-lg min-w-64 w-[45%] flex flex-col align-center justify-between space-y-8 pt-0">
      <legend className="text-center px-2 font-medium text-[18px] text-gray-700">
        {legend}
      </legend>
      <ContainerInput>
        <Label htmlFor="startDate" label={labelDate} />
        <DatePicker
          date={date}
          handleDate={(date: Date | undefined) => handleDate(dateKey, date)}
        />
      </ContainerInput>
      <ContainerInput>
        <Label htmlFor="startTime" label={labelTime} />
        <TimePicker
          selectedTime={time}
          handleTime={(timeSelected) => handleTime(timeKey, timeSelected)}
        />
      </ContainerInput>
    </fieldset>
  );
};
