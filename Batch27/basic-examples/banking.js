function chuyentien() {
  // 1. Login
  login('0906545363', 'djfhdfh8757584hg')
    .then(() => {
      // 2. Check destination account
      checkExists('745646574')
        .then(() => {
          // 3. Enter amount of money
          checkBalance('0906545363', 500000)
            .then(() => {
              // 4. Transfer
              transfer('0906545363', '745646574', 500000)
                .then(() => {
                  // 5. Substract
                  substract('0906545363', 500000)
                    .then(() => {
                      // 6. Add
                      add('745646574', 500000)
                        .then(() => {
                          // Logs
                        })
                        .catch((error) => {});
                    })
                    .catch((error) => {});
                })
                .catch((error) => {});
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    })
    .catch((error) => {});
}

async function chuyentien2() {
  // 1.
  try {
    await login('0906545363', 'djfhdfh8757584hg');
  } catch (error) {}

  // 2.
  try {
    await checkExists('745646574');
  } catch (error) {}

  // 3.
  try {
    await checkBalance('0906545363', 500000);
  } catch (error) {}

  try {
    await transfer('0906545363', '745646574', 500000);
  } catch (error) {}

  try {
    await substract('0906545363', 500000);
  } catch (error) {}

  try {
    await add('745646574', 500000);
  } catch (error) {}

  await logs;
}
