export default function OctaDeskScreen() {
  return (
    <>
      <iframe
        src="https://api-homolog.spacearena.net/proxy/octadesk/chat/empty"
        style={{ width: '100%', height: 'calc(100vh - 64px)', border: 'none' }}
      />
    </>
  );
}