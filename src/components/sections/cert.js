import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';


const StyledCertSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }


    .cert-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledCert = styled.li`

  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .cert-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .cert-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    display: block;
    position: relative;
    height: 100%;
    width: 100%;
    margin-right:300px;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .cert-top {

    ${({ theme }) => theme.mixins.flexBetween};
     display: flex;
     flex-wrap:nowrap;

      .certicon {
      color: var(--green);
      svg {
        width: 30px;
        height: 30px;
      }
    }

    .cert-links {
      display: flex;
      align-items: center;
      margin-left: auto; /* Move to the far right */

      // margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  .cert-title {
    margin: 0 auto;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    text-align: center;
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Add ellipsis for overflow text */
    flex: 1; /* Allow title to take up remaining space */
    padding: 0 10px; /* Add padding for spacing */

    a {
      position: static;
      margin-left: 10px;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

`;

const Cert = () => {
  const data = useStaticQuery(graphql`
    query {
      cert: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/cert/" }
          frontmatter: { showInCert: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              external
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealCert = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealCert.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 4;
  const cert = data.cert.edges.filter(({ node }) => node);
  const firstSix = cert.slice(0, GRID_LIMIT);
  const certToShow = showMore ? cert : firstSix;

  const certInner = node => {
    const { frontmatter, html } = node;
    const { external, title } = frontmatter;

    return (
      <div className="cert-inner">
        <header>
          <div className="cert-top">
            <div className="certicon">
              <Icon name="Certification" />
              
            </div>
            <h3 className="cert-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>
            <div className="cert-links">

              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
            
          </div>



        </header>

      </div>
    );
  };

  return (
    <StyledCertSection>
      <h2 ref={revealTitle}>Certifications</h2>

      <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        View Archive
      </Link>

      <ul className="cert-grid">
        {prefersReducedMotion ? (
          <>
            {certToShow &&
              certToShow.map(({ node }, i) => (
                <StyledCert key={i}>{certInner(node)}</StyledCert>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {certToShow &&
              certToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledCert
                    key={i}
                    ref={el => (revealCert.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {certInner(node)}
                  </StyledCert>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>      
    </StyledCertSection>
  );
};

export default Cert;
