import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hello! My name is</h1>;
  const two = <h2 className="big-heading">Maheboob Patel</h2>;
  const three = <h3 className="medium-heading"> DevOps | Data | DevRel </h3>;
  const four = (
    <>
      <p>
        <b>Glad to e-meet you!</b>
      </p>

      <p>
        I am passionate Cloud and DevOps engineer , a National Level Winner for {' '} <a href="https://adlchallenge.in/">
        Microsoft Azure India</a> {' '} and a MCA PostGrad from {' '} <a href="https://www.timscdrmumbai.in/">Thakur Institute</a> {' '} currently spearheading impactful deployment operations at {' '}
        <a href="https://www.kelpglobal.com">KelpGlobal</a>.
      </p>


      <p>
      When not on tech , you'll find me playing{' '} 🎹 melodies{' '} or chasing breathtaking{' '} 🌅 sunsets{' '}.
      </p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href="https://www.linkedin.com/in/maheboob-patel/"
      target="_blank"
      rel="noreferrer">
      Check out my linkedin!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
