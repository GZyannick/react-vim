export const getTime = () => {
  let date = new Date();
  let min = date.getMinutes()
  if(min < 10) min = `0${min}`
  return `${date.getHours()} : ${min} `
}


