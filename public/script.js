const defaultChannel = 'my-channel';

const textarea = document.getElementById('shared');
const channelInput = document.getElementById('channelInput');

const STORAGE_KEY = 'telegrapho.channel';

let currentChannel = getInitialChannel();
let socket = null;
let changeTimer = null;

let sendTimer = null;

function sanitizeChannel(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .slice(0, 64);
}

function getChannelFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return sanitizeChannel(params.get('channel'));
}

function getInitialChannel() {
    const fromUrl = getChannelFromUrl();
    if (fromUrl) return fromUrl;

    const fromStorage = sanitizeChannel(localStorage.getItem(STORAGE_KEY));
    if (fromStorage) return fromStorage;

    return defaultChannel;
}


function updateUrl(channel) {
    const url = new URL(window.location.href);

    if (channel === defaultChannel) {
        url.searchParams.delete('channel');
    } else {
        url.searchParams.set('channel', channel);
    }

    window.history.replaceState({}, '', url.toString());
}

function connect(channel) {
    if (socket) {
        socket.off();
        socket.disconnect();
    }

    socket = io({
        query: { channel: channel }
    });


    socket.on('connect', () => {
        console.log(`Connected to channel: ${channel}`);
        document.getElementById('currentChannel').textContent = channel;
    });

    socket.on('sync', (text) => {
        const changed = textarea.value !== text
        if (changed) {
            textarea.value = text
            updateFingerprint(text);
            //navigator.vibrate?.(35)
        }
    });

}

function applyChannel(channel) {
    clearTimeout(sendTimer);
    clearTimeout(changeTimer);
    const safeChannel = sanitizeChannel(channel) || defaultChannel;
    currentChannel = safeChannel;

    channelInput.value = safeChannel;
    localStorage.setItem(STORAGE_KEY, safeChannel);
    updateUrl(safeChannel);
    connect(safeChannel);
}

channelInput.value = currentChannel;
updateUrl(currentChannel);
connect(currentChannel);

/*
        channelInput.addEventListener('change', () => {
            applyChannel(channelInput.value);
        });
*/

channelInput.addEventListener('input', () => {
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => {
        if (channelInput.value !== currentChannel) {
            applyChannel(channelInput.value);
        }
    }, 400);
});





textarea.addEventListener('input', () => {
    if (!socket) return;

    clearTimeout(sendTimer);
    sendTimer = setTimeout(() => {
        socket.emit('edit', textarea.value);
        updateFingerprint(textarea.value);
    }, 400);
});


function donateModal() {

    const addr = "thanksalot@walletofsatoshi.com"

    Swal.fire({
        title: "Send a Lightning tip ⚡",
        html: `
      <div style="margin-top:10px;font-size:16px;color:#888">
        If this tool is useful to you, consider a tip to support development and maintenance. Thank you! 🙏
        <br><br>
        Lightning Address ⚡
      </div>

        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=lightning:${addr}"
           style="margin:10px auto;display:block">


      <div style="margin-top:4px;font-size:14px;font-family:monospace">
        ${addr}
      </div>
    `,
        confirmButtonText: "Copy Lightning address",
        confirmButtonColor: '#0fa90f',
    }).then((result) => {
        if (result.isConfirmed) {
            copyText(addr)
        }
    })
}


async function copyText(text) {

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(text)

        } else {

            const t = document.createElement("textarea")

            t.value = text

            document.body.appendChild(t)

            t.select()

            document.execCommand("copy")

            document.body.removeChild(t)

        }

        Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            title: "Text copied",
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {

        Swal.fire({
            toast: true,
            position: "top",
            icon: "error",
            title: "Failed to copy",
            showConfirmButton: false,
            timer: 1500
        })

    }

}



window.addEventListener('load', () => {

    document.getElementById("donateBtn").addEventListener("click", donateModal);
    document.getElementById("qrBtn").addEventListener("click", qrModal);

    // show modal on first visit, explaining the porpose of the app
    if (localStorage.getItem('telegrapho.visited') !== 'true') {
        localStorage.setItem('telegrapho.visited', 'true');
        setTimeout(() => {
            Swal.fire({
                title: "Welcome to Telegrapho 👋",
                html: `<h1>Stop pasting sensitive text into third-party apps.</h1>

                <p>
                    Telegrapho creates a private realtime channel between your own devices using your self-hosted
                    server.
                </p>

                <p style="margin-top:12px;">
                    Copy on mobile. Receive on desktop instantly.<br>
                    Your text. Your server. Your control.
                </p>`,
                confirmButtonText: "Got it!",
                confirmButtonColor: '#2563eb',
            });
        }, 800);
    }

    textarea.focus()

})


function updateFingerprint(text) {

    const target = document.getElementById('fingerprint');

    if (!target) return;
    if (!text) {
        target.textContent = '--';
        return;
    }

    let hash = 2166136261;

    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash +=
            (hash << 1) +
            (hash << 4) +
            (hash << 7) +
            (hash << 8) +
            (hash << 24);
    }

    hash >>>= 0;

    const hex = hash
        .toString(16)
        .padStart(8, '0');

    target.textContent =
        hex.slice(0, 4) +
        '-' +
        hex.slice(4);

}



document.getElementById('clearBtn').addEventListener('click', () => {

    textarea.value = '';

    updateFingerprint('');

    clearTimeout(sendTimer);

    if (socket?.connected) {
        socket.emit('edit', '');
    }

    textarea.focus();

});




document.getElementById('copyBtn').addEventListener('click', () => {

    const text = textarea.value;

    if (!text) return;

    copyText(text);
});


function qrModal() {
    let text = textarea.value;
    if (!text) return;

    text = text.slice(0, 1000);

    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '10px';

    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    img.style.margin = '10px auto';
    img.style.display = 'block';
    img.style.borderRadius = '12px';

    const preview = document.createElement('div');
    preview.style.marginTop = '12px';
    preview.style.fontSize = '13px';
    preview.style.fontFamily = 'monospace';
    preview.style.wordBreak = 'break-all';
    preview.style.color = '#aaa';
    preview.textContent = text.length > 128 ? text.slice(0, 128) + '...' : text;

    wrapper.appendChild(img);
    wrapper.appendChild(preview);

    Swal.fire({
        title: 'QR Code',
        html: wrapper,
        confirmButtonText: 'Copy text',
        confirmButtonColor: '#2563eb',
        width: 380,
    }).then((result) => {
        if (result.isConfirmed) copyText(text);
    });
}