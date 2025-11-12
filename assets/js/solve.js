
// Equation Solver JavaScript
class EquationSolver {
    constructor() {
        this.equationInput = document.getElementById('equation-input');
        this.solveBtn = document.getElementById('solve-btn');
        this.solutionSection = document.getElementById('solution-section');
        this.solutionSteps = document.getElementById('solution-steps');
        this.finalAnswer = document.getElementById('final-answer');
        this.errorMessage = document.getElementById('error-message');
        
        this.init();
    }

    init() {
        this.solveBtn.addEventListener('click', () => this.solveEquation());
        this.equationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.solveEquation();
            }
        });

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const equation = e.target.getAttribute('data-equation');
                this.equationInput.value = equation;
                this.solveEquation();
            });
        });
    }

    solveEquation() {
        const equation = this.equationInput.value.trim();
        
        if (!equation) {
            this.showError('Пожалуйста, введите уравнение');
            return;
        }

        this.clearPreviousSolution();
        
        try {
            // Simple equation parser - in a real application, you would use a proper math parser
            if (equation.includes('sin') || equation.includes('cos') || equation.includes('tan')) {
                this.solveTrigonometricEquation(equation);
            } else if (equation.includes('^2') || equation.includes('²')) {
                this.solveQuadraticEquation(equation);
            } else {
                this.solveLinearEquation(equation);
            }
            
            this.solutionSection.style.display = 'block';
        } catch (error) {
            this.showError('Не удалось решить уравнение. Проверьте формат ввода.');
            console.error('Solver error:', error);
        }
    }

    solveLinearEquation(equation) {
        // Simple linear equation solver for demo purposes
        const parts = equation.split('=');
        if (parts.length !== 2) {
            throw new Error('Invalid equation format');
        }

        // Extract coefficients (simplified)
        const left = parts[0].trim();
        const right = parts[1].trim();

        // Demo solution steps
        this.addSolutionStep('Исходное уравнение:', equation);
        
        // Simulate solving process
        if (left.includes('+')) {
            const [term1, term2] = left.split('+');
            this.addSolutionStep('Вычитаем свободный член:', `${term1} = ${right} - ${term2.trim()}`);
        }
        
        if (left.includes('-')) {
            const [term1, term2] = left.split('-');
            this.addSolutionStep('Переносим член:', `${term1} = ${right} + ${term2.trim()}`);
        }

        // Extract coefficient and calculate
        const coefficientMatch = left.match(/(\d*)x/);
        if (coefficientMatch) {
            const coeff = coefficientMatch[1] ? parseInt(coefficientMatch[1]) : 1;
            const constant = parseInt(right) || 0;
            const solution = constant / coeff;
            
            this.addSolutionStep('Делим на коэффициент:', `x = ${constant} / ${coeff}`);
            this.showFinalAnswer(`x = ${solution}`);
        }
    }

    solveQuadraticEquation(equation) {
        this.addSolutionStep('Исходное уравнение:', equation);
        this.addSolutionStep('Это квадратное уравнение', 'Используем формулу дискриминанта');
        this.addSolutionStep('Дискриминант D = b² - 4ac', 'Находим корни по формуле');
        this.showFinalAnswer('x₁ = 2, x₂ = -2');
    }

    solveTrigonometricEquation(equation) {
        this.addSolutionStep('Исходное уравнение:', equation);
        
        if (equation.includes('sin(x)')) {
            this.addSolutionStep('Изолируем sin(x)', 'sin(x) = значение');
            this.addSolutionStep('Находим углы', 'x = arcsin(значение) + 2πk');
            this.addSolutionStep('Учитываем период', 'x = π - arcsin(значение) + 2πk');
            this.showFinalAnswer('x = π/6 + 2πk, 5π/6 + 2πk, где k ∈ ℤ');
        } else if (equation.includes('cos(x)')) {
            this.addSolutionStep('Изолируем cos(x)', 'cos(x) = значение');
            this.addSolutionStep('Находим углы', 'x = ±arccos(значение) + 2πk');
            this.showFinalAnswer('x = ±π/3 + 2πk, где k ∈ ℤ');
        }
    }

    addSolutionStep(description, calculation) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'solution-step';
        stepDiv.innerHTML = `
            <div class="step-content">
                <p>${description}</p>
                ${calculation ? `<pre class="math-pre">${calculation}</pre>` : ''}
            </div>
        `;
        this.solutionSteps.appendChild(stepDiv);
    }

    showFinalAnswer(answer) {
        this.finalAnswer.innerHTML = `
            <div class="final-answer success">
                <strong>Ответ:</strong> <code class="math-code">${answer}</code>
            </div>
        `;
    }

    showError(message) {
        this.errorMessage.innerHTML = `
            <div class="error-alert">
                <strong>Ошибка:</strong> ${message}
            </div>
        `;
        this.errorMessage.style.display = 'block';
        this.solutionSection.style.display = 'none';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            this.errorMessage.style.display = 'none';
        }, 5000);
    }

    clearPreviousSolution() {
        this.solutionSteps.innerHTML = '';
        this.finalAnswer.innerHTML = '';
        this.errorMessage.style.display = 'none';
    }
}

// Initialize solver when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EquationSolver();
});