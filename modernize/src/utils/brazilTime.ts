import { DateTime } from 'luxon';

function getBrazilTime(): string {
  const brazilTime = DateTime.now().setZone('America/Sao_Paulo');
  return brazilTime.toFormat('yyyy-MM-dd HH:mm:ss');
}

export default getBrazilTime;
