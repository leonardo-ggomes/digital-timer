import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';
import { DigitalTimer } from 'digital-timer';

let paneCreated = false;
let pane;

document.addEventListener('DOMContentLoaded', () => {
  const timer = new DigitalTimer({
    container: '#timer',
    isTimeNow: true,
    fontSize: 140,
    hours: 0,
    minutes: 0,
    seconds: 30,
    onEnd: () => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    },
    onConfig: () => {
      const container = document.getElementById('config-pane');
  
      // Toggle do painel: mostra ou oculta
      if (!paneCreated) {
        container.style.display = 'block';
        paneCreated = true;
  
        const params = {
          Horas: timer.time.hours,
          Minutos: timer.time.minutes,
          Segundos: timer.time.seconds,
          'Fonte (px)': timer.fontSize,
        };
  
        pane = new Pane({ container});
        
        const folder = pane.addFolder({
          title: 'Config',
          expanded: false 
        });

        folder.addBinding(params, 'Horas', { min: 0, max: 23, step: 1 });
        folder.addBinding(params, 'Minutos', { min: 0, max: 59, step: 1 });
        folder.addBinding(params, 'Segundos', { min: 0, max: 59, step: 1 });
        folder.addBinding(params, 'Fonte (px)', { min: 30, max: 180, step: 1 }).on('change', ev => {
          timer.fontSize = ev.value;
          timer.render(); // re-renderiza com nova fonte
        });
  

        folder.addButton({ title: "Tempo atual" }).on('click', () => {
          timer.isTimeNow = true;
          timer.start();
        });

        folder.addButton({ title: "Aplicar e Iniciar" }).on('click', () => {
          timer.isTimeNow = false;
          timer.reset(params.Horas, params.Minutos, params.Segundos);
          timer.start();
        });
  
      } else {
        // Toggle de visibilidade
        container.style.display = (container.style.display === 'none') ? 'block' : 'none';
      }
    }
  });
  
  timer.start();
  timer.onConfig();
});



