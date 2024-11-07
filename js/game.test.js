test('Should hide impressum when goBack() function is called', () => {
  document.body.innerHTML = `
    <div id="description" class="show"></div>
    <div id="impressum" class="show"></div>
  `;
  
  goBack();
  
  const impressum = document.getElementById('impressum');
  expect(impressum.classList.contains('hidden')).toBe(true);
  expect(impressum.classList.contains('show')).toBe(false);
});