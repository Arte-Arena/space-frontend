import { DateTime } from 'luxon';

function getBrazilTime(): Date {
  const brazilTime = DateTime.now().setZone('America/Sao_Paulo');
  const jsDate = brazilTime.toJSDate();
  return jsDate;
}

export default getBrazilTime;
