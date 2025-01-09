import { DateTime } from 'luxon';

function getBrazilTime(): Date {
  const brazilTime = DateTime.now().setZone('America/Sao_Paulo');
  // console.log('brazilTime: ', brazilTime);
  const jsDate = brazilTime.toJSDate();
  // console.log('brazilTime (toJSDate()): ', jsDate);
  return jsDate;
}

export default getBrazilTime;
