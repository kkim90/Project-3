import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Tone from 'tone';
import useBPM from './useBPM';
import useStart from './useStart';
import stepContext from './stepContext';
import Transport from './transport';
import StepSequencer from './stepSequencer';
import FX from './FX';

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  background: linear-gradient(to bottom right, #222, #0a0a0a);
  border: 2px solid black;
  border-radius: 4px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  flex: 1;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  padding: 0px 20px 10px;
  display: flex;
`;

const Logo = styled.h1`
  font-size: 28px;
  color: #25ccf7;
  font-family: 'Electrolize', sans-serif;
  padding: 20px;
  margin: 0;
  text-transform: uppercase;
  display: inline-block;
`;


const config = {
  tracks: ['Kick', 'Sub1', 'Sub2', 'Snare', 'Clap', 'HiHat', 'OpenHiHat', 'Ride'],
  samples: {
    Kick: 'sounds/kick.wav',
    Sub1: 'sounds/bass.wav',
    Sub2: 'sounds/sub.wav',
    Snare: 'sounds/snare.wav',
    Clap: 'sounds/clap.wav',
    HiHat: 'sounds/hihat.wav',
    OpenHiHat: 'sounds/openhihat.wav',
    Ride: 'sounds/ride.wav',
  },
};

const initialStepState = {
  Kick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Sub1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Sub2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Snare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Clap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  HiHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  OpenHiHat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Ride: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

export default function DrumMachine() {
  const [stepState, setSteps] = useState(initialStepState);
  const [buffers, setBuffers] = useState({});
  const [currentStep, setCurrentStepState] = useState(0);

  const [start, startButton] = useStart();
  const [bpm, bpmSelector] = useBPM(65);

  const buffersRef = useRef(buffers);
  buffersRef.current = buffers;
  const stepsRef = useRef(stepState);
  stepsRef.current = stepState;
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  useEffect(
    () => {
      Tone.Transport.scheduleRepeat(function(time) {
        Object.keys(buffersRef.current).forEach(b => {
          let targetStep = stepsRef.current[b][currentStepRef.current];
          let targetBuffer = buffersRef.current[b];
          if (targetStep === 1) {
            targetBuffer.start(time);
          } else if (targetStep === 2) {
            targetBuffer.start();
            targetBuffer.start('+64n');
            targetBuffer.start('+32n');
          }
        });

        setCurrentStepState(step => {
          return step > 14 ? 0 : step + 1;
        });
      }, '16n');
    },
    [config]
  );

  useEffect(
    () => {
      Tone.Transport.bpm.value = bpm;
    },
    [bpm]
  );

  useEffect(
    () => {
      if (start) {
        Tone.Transport.start();
      } else {
        Tone.Transport.stop();
        setCurrentStepState(0);
      }
    },
    [start]
  );

  return (
    <stepContext.Provider value={{ state: stepState, setSteps }}>
      <Container>
        <Transport>
          <Logo>RDM 3000</Logo>
          {bpmSelector}
          {startButton}
          {/* {save} */}
        </Transport>
        <React.Suspense fallback={<p>Loading</p>}>
          <StepSequencer
            config={config}
            currentStep={currentStepRef.current}
            playing={start}
            setBuffers={setBuffers}
          />
          <ButtonContainer>
            <FX sound="sounds/crash.wav" title="Crash" />
            <FX sound="sounds/cowbell.wav" title="Cowbell" />
            <FX sound="sounds/tom-hi.wav" title="Hi-Tom" />
            <FX sound="sounds/tom-low.wav" title="Low-Tom" />
            <FX sound="sounds/horn.wav" title="Horn" />
          </ButtonContainer>
        </React.Suspense>
      </Container>
    </stepContext.Provider>
  );
}


