import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';

import stepContext from './stepContext';
import Step from './step';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

export default function steps(props) {
  const context = useContext(stepContext);
  const steps = useMemo(() => context.state[props.name], [
    context.state[props.name],
  ]);

  return (
    <Wrapper>
      {steps.map((s, i) => (
        <Step
          on={s !== 0}
          doubled={s === 2}
          index={i}
          key={i}
          name={props.name}
        />
      ))}
    </Wrapper>
  );
}
