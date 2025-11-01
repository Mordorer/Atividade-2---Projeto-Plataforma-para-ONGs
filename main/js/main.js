// =======================================
// 6. SCRIPTS UNIFICADOS
// =======================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNÇÃO DE NOTIFICAÇÃO GLOBAL (comunidade.html, cadastro.html) ---
    function showTemporaryMessage(message, success = true) {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notification-message');
        
        messageEl.textContent = message;
        
        notification.classList.remove('success', 'error', 'hidden');
        notification.classList.add(success ? 'success' : 'error');

        // Animação de entrada
        notification.classList.add('show');

        // Esconde após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            // Oculta completamente após a transição (300ms)
            setTimeout(() => notification.classList.add('hidden'), 300);
        }, 3000);

        // Rola para o topo para garantir que a mensagem seja vista
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // --- 2. MENU MOBILE (Todos os HTMLs) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 3. SCRIPTS ESPECÍFICOS DE CADASTRO (cadastro.html) ---
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        
        // Máscaras de Input
        const masks = {
            cpf: (value) => value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .substring(0, 14),

            telefone: (value) => value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4,5})(\d{4})/, '$1-$2')
                .substring(0, 15),

            cep: (value) => value
                .replace(/\D/g, '')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 9)
        };

        document.querySelectorAll('input').forEach(input => {
            const fieldName = input.id;
            if (masks[fieldName]) {
                input.addEventListener('input', (e) => {
                    e.target.value = masks[fieldName](e.target.value);
                });
            }
        });
        
        // Simulação de Envio
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (this.checkValidity()) {
                showTemporaryMessage('Formulário enviado com Sucesso, aguarde nosso contato!');
                this.reset();
            } else {
                showTemporaryMessage('Por favor, preencha todos os campos obrigatórios corretamente.', false);
                // Adicionar classe 'error' para visualização de campos inválidos (depende do CSS)
                Array.from(this.elements).forEach(el => {
                    if (!el.checkValidity() && el.required) {
                        el.classList.add('error');
                    } else {
                        el.classList.remove('error');
                    }
                });
            }
        });
    }
    
    // --- 4. SCRIPTS ESPECÍFICOS DE COMUNIDADE (comunidade.html) ---
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            
            if (emailInput.value && emailInput.checkValidity()) {
                showTemporaryMessage('Inscrição realizada com Sucesso!');
                emailInput.value = '';
            } else {
                showTemporaryMessage('Por favor, insira um e-mail válido.', false);
            }
        });
    }

    const downloadLinks = document.querySelectorAll('.document-link');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showTemporaryMessage('Preparando arquivo para download');
            const downloadUrl = this.getAttribute('href');
            setTimeout(() => {
                console.log('Iniciando download de:', downloadUrl);
                // window.location.href = downloadUrl; // Simulação de download real
            }, 1500);
        });
    });

    // --- 5. SCRIPTS ESPECÍFICOS DE GESTÃO (gestao.html) ---
    if (document.getElementById('loginForm')) {
        
		const togglePassword = document.getElementById('togglePassword');
        const password = document.getElementById('password');
        const eyeOpen = document.getElementById('eye-open');
        const eyeClosed = document.getElementById('eye-closed');

        if (togglePassword) {
            togglePassword.addEventListener('click', function () {
                // A lógica é: se for 'password' (oculto), mude para 'text' (visível).
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                
                // INVERSÃO CORRIGIDA:
                // Se o tipo for 'text' (visível), mostre o olho fechado (para ocultar).
                if (type === 'text') {
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                } else { // Se o tipo for 'password' (oculto), mostre o olho aberto (para visualizar).
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                }
            });
        }
        
        // Simulação de Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('dashboard-content').classList.remove('hidden');
        });

        // Simulação de CRUD de Projetos
        let editingProjectId = null;
        const projectForm = document.getElementById('projectForm');
        const projectList = document.getElementById('project-list');
        const saveProjectButton = document.getElementById('saveProjectButton');
        const cancelEditButton = document.getElementById('cancelEditButton');
        const formTitle = document.getElementById('form-title');

        const categoryMap = {
            'educacao': { text: 'Educação', class: 'badge-educacao' },
            'saude': { text: 'Saúde', class: 'badge-saude' },
            'meio-ambiente': { text: 'Meio Ambiente', class: 'badge-meio-ambiente' },
            'cultura': { text: 'Cultura', class: 'badge-cultura' }
        };
        
        function resetProjectForm() {
            projectForm.reset();
            editingProjectId = null;
            formTitle.textContent = 'Cadastrar Novo Projeto';
            saveProjectButton.textContent = 'Salvar Projeto';
            cancelEditButton.classList.add('hidden');
            document.getElementById('projectImageUrl').value = '';
        }

        function getCategoryHtml(categoryValue) {
            const categoryInfo = categoryMap[categoryValue] || { text: 'Outro', class: 'badge' };
            return `<span class="badge ${categoryInfo.class}">${categoryInfo.text}</span>`;
        }

        function getImageUrl(file) {
            return new Promise((resolve) => {
                if (!file) {
                    resolve('https://placehold.co/600x400/cccccc/ffffff?text=Sem+Foto');
                    return;
                }
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        async function addNewProject(data) {
            const newId = Date.now().toString();
            const imageUrl = await getImageUrl(data.media);
            
            const newRow = document.createElement('tr');
            newRow.dataset.id = newId;
            newRow.dataset.image = imageUrl;

            newRow.innerHTML = `
                <td class="p-md"><img src="${imageUrl}" alt="${data.name}" class="h-10 w-16 object-cover rounded-lg"></td>
                <td class="p-md" data-field="name">${data.name}</td>
                <td class="p-md" data-field="category" data-category-value="${data.category}">${getCategoryHtml(data.category)}</td>
                <td class="p-md space-x-2">
                    <button class="edit-btn btn btn-neutral text-sm">Editar</button>
                    <button class="gallery-btn btn btn-neutral text-sm">Galeria</button>
                </td>
                <td class="hidden" data-field="description">${data.description}</td>
                <td class="hidden" data-field="impact">${data.impact}</td>
            `;
            
            projectList.appendChild(newRow);
            resetProjectForm();
        }

        async function updateProject(id, data) {
            const row = projectList.querySelector(`tr[data-id="${id}"]`);
            if (!row) return;

            let imageUrl = data.imageUrl;
            if (data.media) {
                imageUrl = await getImageUrl(data.media);
            }
            
            row.dataset.image = imageUrl;

            row.querySelector('img').src = imageUrl;
            row.querySelector('img').alt = data.name;
            row.querySelector('[data-field="name"]').textContent = data.name;
            row.querySelector('[data-field="category"]').innerHTML = getCategoryHtml(data.category);
            row.querySelector('[data-field="category"]').dataset.categoryValue = data.category;
            row.querySelector('[data-field="description"]').textContent = data.description;
            row.querySelector('[data-field="impact"]').textContent = data.impact;

            resetProjectForm();
        }

        function startEditProject(id, row) {
            editingProjectId = id;

            const name = row.querySelector('[data-field="name"]').textContent;
            const category = row.querySelector('[data-field="category"]').dataset.categoryValue;
            const description = row.querySelector('[data-field="description"]').textContent;
            const impact = row.querySelector('[data-field="impact"]').textContent;
            const imageUrl = row.dataset.image;

            document.getElementById('projectName').value = name;
            document.getElementById('projectCategory').value = category;
            document.getElementById('projectDescription').value = description;
            document.getElementById('projectImpact').value = impact;
            document.getElementById('projectImageUrl').value = imageUrl;

            formTitle.textContent = 'Editar Projeto';
            saveProjectButton.textContent = 'Atualizar Projeto';
            cancelEditButton.classList.remove('hidden');

            formTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (projectForm) {
            projectForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('projectName').value,
                    category: document.getElementById('projectCategory').value,
                    description: document.getElementById('projectDescription').value,
                    impact: document.getElementById('projectImpact').value,
                    media: document.getElementById('projectMedia').files[0],
                    imageUrl: document.getElementById('projectImageUrl').value
                };
                
                if (editingProjectId) {
                    updateProject(editingProjectId, formData);
                } else {
                    if (!formData.media) {
                        alert('Por favor, adicione uma foto principal para o novo projeto.');
                        return;
                    }
                    addNewProject(formData);
                }
            });

            cancelEditButton.addEventListener('click', resetProjectForm);
        }

        if (projectList) {
            projectList.addEventListener('click', function(e) {
                const editButton = e.target.closest('.edit-btn');
                if (editButton) {
                    const row = editButton.closest('tr');
                    const id = row.dataset.id;
                    startEditProject(id, row);
                }
                
                const galleryButton = e.target.closest('.gallery-btn');
                if (galleryButton) {
                    alert('Funcionalidade "Galeria" ainda não implementada.');
                }
            });
        }
    }
});