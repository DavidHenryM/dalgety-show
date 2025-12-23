export function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export const daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const months = [
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
]

export function getDateString(date: Date): string{
  const day = daysOfTheWeek[date.getDay()]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const dateDay = date.getDate()
  let dateDayString
  if (dateDay == 1){
    dateDayString = "1st"
  } else if (dateDay == 2){
    dateDayString = "2nd"
  } else if (dateDay == 3){
    dateDayString = "3rd"
  } else {
    dateDayString = `${dateDay}th`
  }
  return `${day} the ${dateDayString} of ${month} ${year}`
}

export function getNextShowDate(): Date {
  const now = new Date();
  const currentYear = now.getFullYear()
  let nextShowDay = getSecondSundayOfMarch(currentYear)
  if (nextShowDay < new Date()){
    nextShowDay = getSecondSundayOfMarch(currentYear + 1)
  }
  return nextShowDay
}

function getSecondSundayOfMarch(year: number) {
  // Start with March 14th, the latest possible date
  const date = new Date(year, 2, 14); // Note: Month is 0-indexed (2 = March)
  
  // getDay() returns 0 for Sunday. Subtract the day of the week
  // from the 14th to "snap" back to the preceding Sunday.
  date.setDate(14 - date.getDay());
  
  return date;
}

