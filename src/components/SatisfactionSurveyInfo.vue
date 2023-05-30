<template>
  <div>
    <div class="card shadow flex-grow-1 vld-parent">
      <div class="card-body">
        <h1 class="card-title mb-4 text-warning">
          Como funciona esta pesquisa?
        </h1>
        <p>
          A pesquisa cadastrada será disponibilizada para os colaboradores
          periodicamente, em versões, de acordo com a
          <span class="font-weight-bold">data de início</span> e
          <span class="font-weight-bold">periodicidade</span>
          informadas. A análise das respostas, por parte do sistema é feita, de
          acordo com o cálculo do NPS, da seguinte maneira:
        </p>
        <p class="mt-2">
          1º) Há um questionamento
          <span class="font-weight-bold">objetivo</span> sobre a satisfação do
          colaborador sobre algum assunto específico, que varia de 0 a 10.
        </p>
        <img
          class="card-img-top"
          src="/img/pages/thermometer.png"
          alt="Imagem curso"
        />
        <ul>
          <li>
            Notas de
            <span class="font-weight-bold text-danger">0 a 6:</span> são
            colaboradores insatisfeitos com o alvo da questão e que não
            acreditam que a empresa seja um exemplo a ser seguido.
          </li>
          <li>
            Notas
            <span class="font-weight-bold text-yellow">7 e 8:</span> são
            colaboradores neutros, que estão passivamente satisfeitos, e não
            apresentam um nível de satisfação que seja um fator dominante para
            recomendação da empresa.
          </li>
          <li>
            Notas
            <span class="font-weight-bold text-success">9 e 10:</span>
            são colaboradores que enxergam o alvo da questão positivamente, se
            sentindo satisfeitos e estando engajados e leais à empresa.
          </li>
        </ul>
        <p>
          2º) É feito um questionamento
          <span class="font-weight-bold">descritivo</span>, onde o colaborador
          pode informar o motivo da escolha de sua resposta.
        </p>
        <p>
          3º) A partir disso, cálculo do NPS interno se dá da seguinte forma:
        </p>
        <img
          class="card-img-top px-5 my-2"
          src="/img/pages/nps.svg"
          alt="Imagem curso"
        />
        <p class="mt-2">
          Com feedbacks periódicos, a análise do NPS e das respostas descritivas
          dos colaboradores é importante para a empresa compreender seus pontos
          fortes e pontos que podem ser melhorados. Na listagem de versões desta
          pesquisa, você poderá visualizar os seus resultados.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "RightSidebar",
};
</script>
<style></style>
