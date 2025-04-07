document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formPopup = new Popup('.popup-overlay');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // TODO: 실제 API 엔드포인트로 데이터 전송
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // });
            
            // 성공 메시지 표시
            const popupContent = formPopup.popup;
            popupContent.querySelector('.popup-title').textContent = '문의가 접수되었습니다';
            popupContent.querySelector('.popup-body').innerHTML = 
                '<p>문의하신 내용이 성공적으로 접수되었습니다.</p>' +
                '<p>빠른 시일 내에 답변 드리도록 하겠습니다.</p>';
            
            formPopup.open();
            contactForm.reset();
            
        } catch (error) {
            console.error('문의 접수 중 오류가 발생했습니다:', error);
            
            // 오류 메시지 표시
            const popupContent = formPopup.popup;
            popupContent.querySelector('.popup-title').textContent = '오류가 발생했습니다';
            popupContent.querySelector('.popup-body').innerHTML = 
                '<p>문의 접수 중 오류가 발생했습니다.</p>' +
                '<p>잠시 후 다시 시도해 주세요.</p>';
            
            formPopup.open();
        }
    });
}); 