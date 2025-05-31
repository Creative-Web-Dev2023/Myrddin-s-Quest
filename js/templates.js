function generateStartContentHTML() {
  return /* html */ `
        <div id="inner_start_container" class="inner-start-container">
              <svg
                class="banner"
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 447 1024 130"
              >
                <defs>
                  <style>
                    .cls-1 {
                      fill: #f4c059;
                    }
                    .cls-2 {
                      fill: #c98f32;
                    }
                    .cls-3 {
                      fill: #ffe9b8;
                    }

                    .banner-text {
                      font-family: 'MedievalSharp', 'Lucida Handwriting',
                        cursive;
                      fill: #5b3c11; /* bleibt dunkel für Kontrast */
                      font-size: 36px;
                      text-anchor: middle;
                      dominant-baseline: middle;
                    }
                  </style>
                </defs>
                <title>ribbon_tilted_down</title>
                <g>
                  <path
                    class="cls-1"
                    d="M897.62,554.76H667.77V447.49H897.62a3,3,0,0,1,2.5,4.65l-32.26,49,32.27,49A3,3,0,0,1,897.62,554.76Z"
                  />
                  <polygon
                    class="cls-2"
                    points="667.77 447.49 798.49 469.24 798.49 576.51 667.77 576.51 667.77 447.49"
                  />
                  <path
                    class="cls-1"
                    d="M126.38,554.76H356.23V447.49H126.38a3,3,0,0,0-2.5,4.65l32.26,49-32.27,49A3,3,0,0,0,126.38,554.76Z"
                  />
                  <polygon
                    class="cls-2"
                    points="356.23 447.49 225.51 469.24 225.51 576.51 356.23 576.51 356.23 447.49"
                  />
                  <rect
                    class="cls-1"
                    x="225.51"
                    y="469.24"
                    width="572.98"
                    height="107.27"
                  />
                  <path
                    class="cls-3"
                    d="M622.72,469.24s-164.61,3.9-219.49,3.79c-44.44-.09-177.72-3.79-177.72-3.79Z"
                  />
                  <path
                    class="cls-2"
                    d="M798.49,469.24S805,501.83,806,512.83c1,10.44,1.07,41.93,1.07,41.93h-8.94Z"
                  />
                  <path
                    class="cls-2"
                    d="M225.51,469.24s-6.46,32.59-7.54,43.59c-1,10.44-1.07,41.93-1.07,41.93h8.94Z"
                  />
                </g>
                <text x="512" y="535" class="banner-text" stroke="#5b3c11" stroke-width="2">
                  Embark on an Epic Adventure
                </text>
              </svg>
              <div class="start-content">
                <div id="h2_headline" class="headline">
                  <button class="arrow-back" onclick="backToMainScreen()">
                    <img
                      src="./assets/img/game_ui/arrow-left.png"
                      alt="Back to main screen"
                      class="d-none"
                    />
                  </button>
                </div>
                <button class="start-button" onclick="showContent('startGame')">
                  <figure class="start-button-content">
                    <img src="./assets/img/game_ui/wizard.png" alt="" />
                    <figcaption>Start game</figcaption>
                  </figure>
                </button>
                <button class="how-to-play-button" onclick="showContent('howToPlay')">How to play</button>
                <button class="imprint-button" onclick="showContent('imprint')">Imprint</button>
                <h2>Myrddin&apos;s <br> Quest</h2>
                <div id="sound_button_wrapper" class="sound-button-wrapper">
                  <figure onclick="toggleSound('music')" class="music-button-wrapper">
                    <img id="music_button" class="music-button" src="./assets/img/game_ui/sounds/music_on.png" alt="">
                    <figcaption id="music_caption" class="music-caption">Music on</figcaption>
                  </figure>
                  <figure onclick="toggleSound('noise')" class="noise-button-wrapper">
                    <img id="noise_button" class="noise-button" src="./assets/img/game_ui/sounds/noise_on.png" alt="">
                    <figcaption id="noise_caption" class="noise-caption">Noise on</figcaption>
                  </figure>
                  </div>
              </div>
            </div>
            <div id="instructions_box" class="instructions-box d-none"></div>
    `;
}


function generateAboutGameHtml() {
  return /*html*/ `
                <div class="game-rules-wrapper styled-about-game">
                  <button class="arrow-back" onclick="backToMainScreen()" >
                    <img src="./assets/img/app_icons/arrow-left.png" alt="Back to main screen">
                  </button>
                  <div class="keyboard-instructions">
                      <table>
                        <thead>
                            <tr>
                                <th colspan="2">How to use the keyboard</th>
                            </tr>
                        </thead>
                          <tr>
                              <td>Left</td>
                              <td>Move left</td>
                          </tr>
                          <tr>
                              <td>Right</td>
                              <td>Move right</td>
                          </tr>
                          <tr>
                              <td>Up</td>
                              <td>Jump</td>
                          </tr>
                          <tr>
                              <td>A</td>
                              <td>Attack</td>
                          </tr>
                          <tr>
                              <td>D</td>
                              <td>Throw</td>
                          </tr>
                      </table>
                  </div>
                </div>
              `;
}

function generateImprintHtml() {
  return /*html*/ `
            <div class="imprint-wrapper styled-imprint">
              <button class="arrow-back" onclick="backToMainScreen()" >
                <img src="./assets/img/app_icons/arrow-left.png" alt="Back to main screen">
              </button>
              <div id="imprintInformation" class="imprint-information">
                  <address>
                  Gabriela Ströbl<br>
                  Enzianstr. 15a<br>
                  85247 Schabhausen
                  </address>
                  <p>
                      Images provided by craftpix.net.
                  </p>
                  <p>
                     2025 Gabriela Ströbl
                  </p>
              </div>
            </div>
          `;
}

// function generateGameOverHTML() {
//   return /*html*/ `
//     <div id="game-over-container" class="end-screen-container hidden">
//       <div class="end-screen-content">
//         <div class="end-screen-image"></div>
//         <div class="end-screen-buttons">
//           <button class="end-screen-btn" id="tryAgainButton">
//             <span>Try Again</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   `;
// }

// function generateWinScreenHTML() {
//   return /*html*/ `
//     <div id="win-screen" class="end-screen-container hidden">
//       <div class="end-screen-content">
//         <div class="end-screen-image"></div>
//         <div class="end-screen-buttons">
//           <button class="end-screen-btn" id="winTryAgainButton">
//             <span>Play Again</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   `;
// }
function generateWinnerScreenHTML() {
  return /* html */ `
  <div class="winner-screen-wrapper">
    <div class="inner-winner-screen-wrapper">
      <figure>
        <img src="../assets/img/game_ui/victory/knight_win.png" alt="">
      </figure>
      <p>Congratulations. You won!</p>
      <div class="retry-button-wrapper">
        <button onclick="showStartScreen()">Play again</button>
      </div>
    </div>
  </div>
  `;
}

function generateLoserScreenHTML() {
  return /* html */ `
  <div class="loser-screen-wrapper">
    <div class="inner-loser-screen-wrapper">
      <figure>
        <img src="../assets/img/game_ui/failure/game_lost.png" alt="">
      </figure>
      <p>Sorry. You lost!</p>
      <div class="retry-button-wrapper">
        <button onclick="showStartScreen()">Play again</button>
      </div>
    </div>
  </div>
  `;
}