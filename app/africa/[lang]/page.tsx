type Props = {
  params: {
    lang: string;
  };
};

export default function AfricaLanguageHome({ params }: Props) {
  const { lang } = params;

  return (
    <section style={{ maxWidth: "900px" }}>
      <h1>Market Frameworks for African Economies</h1>

      <p>
        This Africa mirror adapts Edunancial’s capital awareness and decision
        frameworks for regional economic conditions across the continent.
      </p>

      <p>
        Current language: <strong>{lang.toUpperCase()}</strong>
      </p>

      <ul>
        <li>Capital flow awareness</li>
        <li>Risk-adjusted business structuring</li>
        <li>Market-specific operational models</li>
        <li>Scalable frameworks for emerging economies</li>
      </ul>

      <p>
        Additional localized language versions will be introduced as regional
        deployments expand.
      </p>
    </section>
  );
}
